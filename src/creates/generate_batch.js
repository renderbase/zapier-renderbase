/**
 * Generate Batch Action
 *
 * Generates multiple documents from a single template with different variables.
 * Useful for bulk document generation like invoices or reports.
 */

const { API_BASE_URL } = require('../lib/config');
const {
  batchFields,
  buildBatchPayload,
  batchOutputFields,
} = require('../lib/action_helpers');

const perform = async (z, bundle) => {
  const payload = buildBatchPayload(bundle);

  const response = await z.request({
    url: `${API_BASE_URL}/v1/batches/generate`,
    method: 'POST',
    body: payload,
  });

  return response.data;
};

module.exports = {
  key: 'generate_batch',
  noun: 'Batch',

  display: {
    label: 'Generate Batch Documents',
    description:
      'Generate multiple documents from a single template with different variables. Perfect for bulk invoice generation, reports, or certificates.',
  },

  operation: {
    perform,

    inputFields: batchFields,

    sample: {
      id: 'batch_abc123',
      status: 'processing',
      templateId: 'tmpl_xyz789',
      format: 'pdf',
      totalDocuments: 10,
      successCount: 0,
      failureCount: 0,
      downloadUrl: null,
      createdAt: '2025-01-15T10:30:00Z',
      completedAt: null,
    },

    outputFields: batchOutputFields,
  },
};
