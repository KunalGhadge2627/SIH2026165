import { ModelHealthStats } from '../types/safety';

export const INITIAL_MODEL_HEALTH: ModelHealthStats = {
  classifier_precision: 0.92,
  classifier_recall: 0.95,
  classifier_f1: 0.93,
  classifier_roc_auc: 0.96,
  lsr_macro_f1: 0.91,
  reviewed_reports_count: 1284,
  corrections_count: 137,
  new_training_labels: 137,
  last_retraining_date: '2026-08-15',
  next_retraining_date: '2026-11-15',
  system_status: {
    database: 'Operational',
    ai_api: 'Operational',
    data_pipeline: 'Operational',
    dashboard: 'Operational'
  }
};
