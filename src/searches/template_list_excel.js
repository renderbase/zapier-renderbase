/**
 * Excel Template List Search (Hidden)
 *
 * Hidden search specifically for Excel templates.
 * Used to power the Excel template dropdown in Generate Excel action.
 */

const { TEMPLATES_ENDPOINT } = require('../lib/config');

const perform = async (z) => {
  const response = await z.request({
    url: TEMPLATES_ENDPOINT,
    method: 'GET',
    params: {
      limit: 100,
      format: 'excel',
    },
  });

  const templates = response.data.data || [];

  return templates.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description || '',
    updatedAt: template.updatedAt,
  }));
};

module.exports = {
  key: 'template_list_excel',
  noun: 'Excel Template',

  display: {
    label: 'Excel Template List',
    description: 'Get a list of Excel templates (used for dynamic dropdowns).',
    hidden: true,
  },

  operation: {
    perform,

    inputFields: [],

    sample: {
      id: 'tmpl_excel123',
      name: 'Monthly Report Template',
      description: 'Standard monthly report Excel template',
      updatedAt: '2025-01-10T15:30:00Z',
    },

    outputFields: [
      { key: 'id', label: 'Template ID', type: 'string' },
      { key: 'name', label: 'Template Name', type: 'string' },
      { key: 'description', label: 'Description', type: 'string' },
      { key: 'updatedAt', label: 'Last Updated', type: 'datetime' },
    ],
  },
};
