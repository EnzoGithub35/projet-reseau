import React from "react";

const DemandeDetail = ({ demande, onClose }) => {
  if (!demande) return null;
  return (
    <div className="demande-detail-modal">
      <div className="demande-detail-content">
        <h2>Détail de la demande</h2>
        <p><b>Site :</b> {demande.website_name}</p>
        <p><b>IP :</b> {demande.target_ip}</p>
        <p><b>Description :</b> {demande.description}</p>
        <p><b>Justification :</b> {demande.justification}</p>
        <p><b>Statut :</b> {demande.status.replaceAll('_', ' ')}</p>
        {demande.admin_comment && <p><b>Commentaire admin :</b> {demande.admin_comment}</p>}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default DemandeDetail;
