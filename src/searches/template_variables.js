/**
 * Template Variables Search (Hidden)
 *
 * This is a hidden search used to power dynamic input fields in actions.
 * It fetches the Zapier-compatible field definitions for a template,
 * enabling dynamic variable input based on the selected template.
 */

const { TEMPLATES_ENDPOINT } = require('../lib/config');

const perform = async (z, bundle) => {
  const templateId = bundle.inputData.templateId;

  if (!templateId) {
    return [];
  }

  try {
    const response = await z.request({
      url: `${TEMPLATES_ENDPOINT}/${templateId}/zapier-fields`,
      method: 'GET',
    });

    // Return the fields array directly for use as dynamic input fields
    return response.data.fields || [];
  } catch (error) {
    // If template not found or error, return empty array
    z.console.log('Error fetching template variables:', error.message);
    return [];
  }
};

module.exports = {
  key: 'template_variables',
  noun: 'Template Variables',

  display: {
    label: 'Template Variables',
    description: 'Get dynamic input fields for a template (used for dynamic field population).',
    hidden: true, // Hidden from users - only for dynamic fields
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'templateId',
        label: 'Template ID',
        type: 'string',
        required: true,
        helpText: 'The template ID (UUID, shortId, or slug) to fetch variables for.',
      },
    ],

    sample: {
      key: 'customerName',
      label: 'Customer Name',
      type: 'string',
      required: false,
      helpText: 'The customer full name',
    },

    outputFields: [
      { key: 'key', label: 'Field Key', type: 'string' },
      { key: 'label', label: 'Field Label', type: 'string' },
      { key: 'type', label: 'Field Type', type: 'string' },
      { key: 'required', label: 'Required', type: 'boolean' },
      { key: 'helpText', label: 'Help Text', type: 'string' },
    ],
  },
};
