/**
 * Batch Completed Trigger
 *
 * Fires when a batch document generation is completed through Renderbase.
 */

const { WEBHOOK_EVENTS } = require('../lib/config');
const {
  subscribeHook,
  unsubscribeHook,
  performHook,
  performList,
  createSampleData,
} = require('../lib/webhook_helpers');

const EVENT_TYPE = WEBHOOK_EVENTS.BATCH_COMPLETED;

module.exports = {
  key: 'batch_completed',
  noun: 'Batch',

  display: {
    label: 'Batch Completed',
    description: 'Triggers when a batch of documents is finished generating through Renderbase.',
  },

  operation: {
    type: 'hook',

    // Subscribe to webhook when Zap is turned on
    performSubscribe: (z, bundle) => subscribeHook(z, bundle, EVENT_TYPE),

    // Unsubscribe when Zap is turned off
    performUnsubscribe: unsubscribeHook,

    // Process incoming webhook
    perform: performHook,

    // Fetch sample data for testing
    performList: (z, bundle) =>
      performList(z, bundle, EVENT_TYPE, createSampleData[EVENT_TYPE]),

    // Sample data structure
    sample: {
      id: 'evt_sample_123',
      type: 'batch.completed',
      timestamp: '2025-01-15T10:30:00Z',
      data: {
        batchId: 'batch_abc123',
        templateId: 'template_xyz789',
        templateName: 'Invoice Template',
        totalDocuments: 10,
        successCount: 9,
        failureCount: 1,
        format: 'pdf',
        status: 'completed',
        downloadUrl: 'https://api.renderbase.dev/v1/batches/batch_abc123/download',
        completedAt: '2025-01-15T10:30:00Z',
      },
    },

    // Output field definitions for mapping in Zapier
    outputFields: [
      { key: 'id', label: 'Event ID', type: 'string' },
      { key: 'type', label: 'Event Type', type: 'string' },
      { key: 'timestamp', label: 'Event Timestamp', type: 'datetime' },
      { key: 'data__batchId', label: 'Batch ID', type: 'string' },
      { key: 'data__templateId', label: 'Template ID', type: 'string' },
      { key: 'data__templateName', label: 'Template Name', type: 'string' },
      { key: 'data__totalDocuments', label: 'Total Documents', type: 'integer' },
      { key: 'data__successCount', label: 'Success Count', type: 'integer' },
      { key: 'data__failureCount', label: 'Failure Count', type: 'integer' },
      { key: 'data__format', label: 'Format', type: 'string' },
      { key: 'data__status', label: 'Status', type: 'string' },
      { key: 'data__downloadUrl', label: 'Download URL (ZIP)', type: 'string' },
      { key: 'data__completedAt', label: 'Completed At', type: 'datetime' },
    ],
  },
};
