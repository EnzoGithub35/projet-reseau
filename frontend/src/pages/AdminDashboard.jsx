import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import requestsApi from "../services/requests";
import AdminDemandeList from "../components/admin/AdminDemandeList";
import AdminDemandeDetail from "../components/admin/AdminDemandeDetail";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDemandes = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await requestsApi.getAll(token, user.id, user.role);
      setDemandes(res.data);
    } catch (e) {
      setError("Erreur lors du chargement des demandes");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchDemandes();
    // eslint-disable-next-line
  }, [user]);

  const handleAction = async (demande, status) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("authToken");
      await requestsApi.update(demande.id, { status }, token);
      setSuccess("Demande mise à jour");
      fetchDemandes();
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de la mise à jour");
    }
    setLoading(false);
  };

  const handleValidate = async (comment) => {
    if (!selected) return;
    await handleAction(selected, "validee_en_cours_implementation", comment);
    setSelected(null);
  };
  const handleRefuse = async (comment) => {
    if (!selected) return;
    await handleAction(selected, "refusee", comment);
    setSelected(null);
  };

  return (
    <div className="dashboard-container">
      <h1>Tableau de bord Administrateur</h1>
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}
      <h2>Toutes les demandes</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <AdminDemandeList
          demandes={demandes}
          onSelect={setSelected}
          onAction={handleAction}
        />
      )}
      <AdminDemandeDetail
        demande={selected}
        onClose={() => setSelected(null)}
        onValidate={handleValidate}
        onRefuse={handleRefuse}
      />
    </div>
  );
};

export default AdminDashboard;
