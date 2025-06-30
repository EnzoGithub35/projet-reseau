import React, { useState } from "react";

const AdminDemandeDetail = ({ demande, onClose, onValidate, onRefuse }) => {
  const [comment, setComment] = useState("");
  if (!demande) return null;
  return (
    <div className="admin-demande-detail-modal">
      <div className="admin-demande-detail-content">
        <h2>Détail de la demande</h2>
        <p><b>Demandeur :</b> {demande.user_id}</p>
        <p><b>Site :</b> {demande.website_name}</p>
        <p><b>IP :</b> {demande.target_ip}</p>
        <p><b>Description :</b> {demande.description}</p>
        <p><b>Justification :</b> {demande.justification}</p>
        <p><b>Statut :</b> {demande.status.replaceAll('_', ' ')}</p>
        {demande.admin_comment && <p><b>Commentaire admin :</b> {demande.admin_comment}</p>}
        {demande.status === "en_attente_validation" && (
          <>
            <textarea
              placeholder="Commentaire (optionnel)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button onClick={() => onValidate(comment)}>Valider</button>
            <button onClick={() => onRefuse(comment)}>Refuser</button>
          </>
        )}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default AdminDemandeDetail;
