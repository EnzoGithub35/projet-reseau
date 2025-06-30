import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import requestsApi from "../services/requests";
import DemandeForm from "../components/demandeur/DemandeForm";
import DemandeList from "../components/demandeur/DemandeList";
import DemandeDetail from "../components/demandeur/DemandeDetail";

const DemandeurDashboard = () => {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
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

  const handleCreate = async (form) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("authToken");
      await requestsApi.create({ ...form, user_id: user.id }, token);
      setShowForm(false);
      setSuccess("Demande créée avec succès");
      fetchDemandes();
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de la création");
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <h1>Tableau de bord Demandeur</h1>
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}
      <button onClick={() => setShowForm((v) => !v)}>
        {showForm ? "Annuler" : "Nouvelle demande"}
      </button>
      {showForm && <DemandeForm onSubmit={handleCreate} loading={loading} />}
      <h2>Mes demandes</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <DemandeList demandes={demandes} onSelect={setSelected} />
      )}
      <DemandeDetail demande={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default DemandeurDashboard;
