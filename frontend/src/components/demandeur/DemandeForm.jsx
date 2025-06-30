import React, { useState } from "react";

const DemandeForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    target_ip: "",
    website_name: "",
    description: "",
    justification: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="demande-form">
      <h2>Nouvelle demande d'accès</h2>
      <label>
        Adresse IP cible
        <input name="target_ip" value={form.target_ip} onChange={handleChange} required />
      </label>
      <label>
        Nom du site/application
        <input name="website_name" value={form.website_name} onChange={handleChange} required />
      </label>
      <label>
        Description du besoin
        <textarea name="description" value={form.description} onChange={handleChange} required />
      </label>
      <label>
        Justification professionnelle
        <textarea name="justification" value={form.justification} onChange={handleChange} required />
      </label>
      <button type="submit" disabled={loading}>Envoyer</button>
    </form>
  );
};

export default DemandeForm;
