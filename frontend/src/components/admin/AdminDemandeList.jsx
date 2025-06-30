import React from "react";

const AdminDemandeList = ({ demandes, onSelect, onAction }) => {
  if (!demandes.length) return <p>Aucune demande à afficher.</p>;
  return (
    <table className="admin-demande-list">
      <thead>
        <tr>
          <th>Demandeur</th>
          <th>Site</th>
          <th>IP</th>
          <th>Statut</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {demandes.map((d) => (
          <tr key={d.id}>
            <td>{d.user_id}</td>
            <td>{d.website_name}</td>
            <td>{d.target_ip}</td>
            <td>{d.status.replaceAll('_', ' ')}</td>
            <td>{new Date(d.created_at).toLocaleString()}</td>
            <td>
              <button onClick={() => onSelect(d)}>Détail</button>
              {d.status === "en_attente_validation" && (
                <>
                  <button onClick={() => onAction(d, "validee_en_cours_implementation")}>Valider</button>
                  <button onClick={() => onAction(d, "refusee")}>Refuser</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminDemandeList;
