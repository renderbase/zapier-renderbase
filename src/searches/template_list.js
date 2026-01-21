/**
 * Template List Search (Hidden)
 *
 * This is a hidden search used to power dynamic dropdowns in actions.
 * Users don't interact with this directly - it provides template options
 * for the template selection fields in Generate Document actions.
 */

const { TEMPLATES_ENDPOINT } = require('../lib/config');

const perform = async (z, bundle) => {
  const params = {
    limit: 100,
  };

  // Filter by format if specified
  if (bundle.inputData.format) {
    params.format = bundle.inputData.format;
  }

  const response = await z.request({
    url: TEMPLATES_ENDPOINT,
    method: 'GET',
    params,
  });

  const templates = response.data.data || [];

  return templates.map((template) => ({
    id: template.id,
    name: template.name,
    format: template.format,
    description: template.description || '',
    updatedAt: template.updatedAt,
  }));
};

module.exports = {
  key: 'template_list',
  noun: 'Template',

  display: {
    label: 'Template List',
    description: 'Get a list of templates (used for dynamic dropdowns).',
    hidden: true, // Hidden from users - only for dropdown population
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'format',
        label: 'Template Format',
        type: 'string',
        required: false,
        choices: {
          pdf: 'PDF Templates',
          excel: 'Excel Templates',
        },
        helpText: 'Filter templates by format.',
      },
    ],

    sample: {
      id: 'tmpl_abc123',
      name: 'Invoice Template',
      format: 'pdf',
      description: 'Standard invoice template',
      updatedAt: '2025-01-10T15:30:00Z',
    },

    outputFields: [
      { key: 'id', label: 'Template ID', type: 'string' },
      { key: 'name', label: 'Template Name', type: 'string' },
      { key: 'format', label: 'Template Format', type: 'string' },
      { key: 'description', label: 'Description', type: 'string' },
      { key: 'updatedAt', label: 'Last Updated', type: 'datetime' },
    ],
  },
};
