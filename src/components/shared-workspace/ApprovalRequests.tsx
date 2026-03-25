import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Loader2,
  Receipt,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "sonner";

interface ApprovalRequest {
  id: string;
  workspace_id: string;
  requester_id: string;
  approver_id: string | null;
  expense_id: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  threshold_amount: number;
  expense_amount: number;
  note: string | null;
  created_at: string;
  resolved_at: string | null;
  requesterName?: string;
}

interface ApprovalSettings {
  id?: string;
  workspace_id: string;
  enabled: boolean;
  threshold_amount: number;
  require_all_members: boolean;
}

interface ApprovalRequestsProps {
  showSettings?: boolean;
  onlyPending?: boolean;
  limit?: number;
}

export function ApprovalRequests({
  showSettings = false,
  onlyPending = false,
  limit,
}: ApprovalRequestsProps) {
  const { workspaceId, members, myRole } = useSharedWorkspace();
  const { user } = useAuth();
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [settings, setSettings] = useState<ApprovalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Temporary state for settings form
  const [tempEnabled, setTempEnabled] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(100);

  const fetchData = async () => {
    if (!workspaceId) return;

    setIsLoading(true);
    try {
      // Fetch requests
      let requestsQuery = supabase
        .from("approval_requests")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (onlyPending) {
        requestsQuery = requestsQuery.eq("status", "pending");
      }

      if (limit) {
        requestsQuery = requestsQuery.limit(limit);
      }

      const { data: requestsData, error: requestsError } = await requestsQuery;
      if (requestsError) throw requestsError;

      const requestsWithNames = (requestsData || []).map((req) => {
        const member = members.find((m) => m.userId === req.requester_id);
        return {
          ...req,
          requesterName: member?.name || "Utente",
        };
      });

      setRequests(requestsWithNames);

      // Fetch settings
      const { data: settingsData } = await supabase
        .from("workspace_approval_settings")
        .select("*")
        .eq("workspace_id", workspaceId)
        .maybeSingle();

      if (settingsData) {
        setSettings(settingsData);
        setTempEnabled(settingsData.enabled);
        setTempThreshold(settingsData.threshold_amount);
      } else {
        setSettings({
          workspace_id: workspaceId,
          enabled: false,
          threshold_amount: 100,
          require_all_members: false,
        });
        setTempEnabled(false);
        setTempThreshold(100);
      }
    } catch (err) {
      console.error("Error fetching approval data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to realtime updates
    if (workspaceId) {
      const channel = supabase
        .channel(`approval-requests-${workspaceId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "approval_requests",
            filter: `workspace_id=eq.${workspaceId}`,
          },
          () => {
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [workspaceId, members]);

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const { error } = await supabase
        .from("approval_requests")
        .update({
          status: "approved",
          approver_id: user?.id,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      // Log activity
      await supabase.from("workspace_activities").insert({
        workspace_id: workspaceId,
        user_id: user?.id,
        action_type: "approval_approved",
        target_type: "expense",
        target_id: requests.find((r) => r.id === requestId)?.expense_id,
        metadata: {},
      });

      toast.success("Richiesta approvata");
    } catch (err) {
      console.error("Error approving request:", err);
      toast.error("Errore nell'approvazione");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const { error } = await supabase
        .from("approval_requests")
        .update({
          status: "rejected",
          approver_id: user?.id,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      // Log activity
      await supabase.from("workspace_activities").insert({
        workspace_id: workspaceId,
        user_id: user?.id,
        action_type: "approval_rejected",
        target_type: "expense",
        target_id: requests.find((r) => r.id === requestId)?.expense_id,
        metadata: {},
      });

      toast.success("Richiesta rifiutata");
    } catch (err) {
      console.error("Error rejecting request:", err);
      toast.error("Errore nel rifiuto");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveSettings = async () => {
    if (!workspaceId) return;

    setIsSavingSettings(true);
    try {
      const settingsToSave = {
        workspace_id: workspaceId,
        enabled: tempEnabled,
        threshold_amount: tempThreshold,
        require_all_members: false,
      };

      const { error } = await supabase
        .from("workspace_approval_settings")
        .upsert(settingsToSave);

      if (error) throw error;

      setSettings(settingsToSave);
      toast.success("Impostazioni salvate");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Errore nel salvataggio");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const canApprove = (req: ApprovalRequest) =>
    req.status === "pending" && req.requester_id !== user?.id;

  if (!workspaceId) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Pending requests section */}
      {pendingRequests.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-yellow-800">
              <Clock className="w-5 h-5" />
              Richieste in attesa ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {pendingRequests.map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    layout
                    className="p-4 bg-white rounded-lg border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {request.requesterName} richiede approvazione
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Spesa di €{request.expense_amount.toLocaleString("it-IT")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Soglia: €{request.threshold_amount.toLocaleString("it-IT")} •{" "}
                            {formatDistanceToNow(new Date(request.created_at), {
                              addSuffix: true,
                              locale: it,
                            })}
                          </p>
                          {request.note && (
                            <p className="text-sm mt-2 p-2 bg-muted/50 rounded">
                              "{request.note}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {canApprove(request) && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                          size="sm"
                          className="flex-1"
                        >
                          {processingId === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approva
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rifiuta
                        </Button>
                      </div>
                    )}

                    {request.requester_id === user?.id && (
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        In attesa di approvazione dagli altri membri
                      </p>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings section (owner only) */}
      {showSettings && myRole === "owner" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Impostazioni Approvazione
            </CardTitle>
            <CardDescription>
              Richiedi approvazione per spese sopra una soglia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Abilita approvazioni</p>
                <p className="text-sm text-muted-foreground">
                  Le spese sopra la soglia richiederanno approvazione
                </p>
              </div>
              <Switch
                checked={tempEnabled}
                onCheckedChange={setTempEnabled}
              />
            </div>

            {tempEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-2"
              >
                <div>
                  <label className="text-sm font-medium">Soglia (€)</label>
                  <Input
                    type="number"
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(Number(e.target.value))}
                    min={1}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Spese sopra €{tempThreshold} richiederanno approvazione
                  </p>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="w-full"
            >
              {isSavingSettings ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Salva Impostazioni"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* History section */}
      {!onlyPending && requests.filter((r) => r.status !== "pending").length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Storico Richieste</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {requests
                .filter((r) => r.status !== "pending")
                .slice(0, 10)
                .map((request) => (
                  <div
                    key={request.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      request.status === "approved" && "bg-green-50",
                      request.status === "rejected" && "bg-red-50",
                      request.status === "cancelled" && "bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {request.status === "approved" && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {request.status === "rejected" && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      {request.status === "cancelled" && (
                        <AlertCircle className="w-5 h-5 text-gray-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          €{request.expense_amount.toLocaleString("it-IT")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.requesterName} •{" "}
                          {formatDistanceToNow(new Date(request.created_at), {
                            addSuffix: true,
                            locale: it,
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        request.status === "approved" && "bg-green-100 text-green-700",
                        request.status === "rejected" && "bg-red-100 text-red-700",
                        request.status === "cancelled" && "bg-gray-100 text-gray-700"
                      )}
                    >
                      {request.status === "approved" && "Approvata"}
                      {request.status === "rejected" && "Rifiutata"}
                      {request.status === "cancelled" && "Annullata"}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!isLoading && requests.length === 0 && !showSettings && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Nessuna richiesta di approvazione
          </p>
        </div>
      )}
    </div>
  );
}
