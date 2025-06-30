import React from "react";

const DemandeList = ({ demandes, onSelect }) => {
  if (!demandes.length) return <p>Aucune demande pour le moment.</p>;
  return (
    <table className="demande-list">
      <thead>
        <tr>
          <th>Site</th>
          <th>IP</th>
          <th>Statut</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {demandes.map((d) => (
          <tr key={d.id}>
            <td>{d.website_name}</td>
            <td>{d.target_ip}</td>
            <td>{d.status.replaceAll('_', ' ')}</td>
            <td>{new Date(d.created_at).toLocaleString()}</td>
            <td>
              <button onClick={() => onSelect(d)}>Détail</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DemandeList;
