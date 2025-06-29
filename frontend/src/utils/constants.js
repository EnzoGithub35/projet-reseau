export const API_BASE_URL = 'http://localhost:8080';

export const REQUEST_STATUS = {
  EN_ATTENTE_VALIDATION: 'en_attente_validation',
  REFUSEE: 'refusee',
  VALIDEE_EN_COURS_IMPLEMENTATION: 'validee_en_cours_implementation',
  REALISEE_EN_ATTENTE_TEST: 'realisee_en_attente_test',
  REALISEE_TEST_OK: 'realisee_test_ok',
  REALISEE_EN_ERREUR: 'realisee_en_erreur'
};

export const REQUEST_STATUS_LABELS = {
  [REQUEST_STATUS.EN_ATTENTE_VALIDATION]: 'En attente de validation',
  [REQUEST_STATUS.REFUSEE]: 'Refusée',
  [REQUEST_STATUS.VALIDEE_EN_COURS_IMPLEMENTATION]: 'Validée, en cours d\'implémentation',
  [REQUEST_STATUS.REALISEE_EN_ATTENTE_TEST]: 'Réalisée, en attente de test',
  [REQUEST_STATUS.REALISEE_TEST_OK]: 'Réalisée, test OK',
  [REQUEST_STATUS.REALISEE_EN_ERREUR]: 'Réalisée, en erreur'
};

export const USER_ROLES = {
  DEMANDEUR: 'demandeur',
  ADMIN: 'admin'
};
