/**
 * Team List Search (Hidden)
 *
 * This is a hidden search used to power dynamic dropdowns in actions.
 * Users don't interact with this directly - it provides team options
 * for the team selection fields in Generate Document actions.
 */

const { INTEGRATION_API_ENDPOINT } = require('../lib/config');

const perform = async (z, bundle) => {
  const response = await z.request({
    url: `${INTEGRATION_API_ENDPOINT}/teams`,
    method: 'GET',
  });

  const teams = response.data || [];

  return teams.map((team) => ({
    id: team.id,
    name: team.isPersonal ? `${team.name} (Personal)` : team.name,
    slug: team.slug,
    isPersonal: team.isPersonal,
    role: team.role,
  }));
};

module.exports = {
  key: 'team_list',
  noun: 'Team',

  display: {
    label: 'Team List',
    description: 'Get a list of teams (used for dynamic dropdowns).',
    hidden: true, // Hidden from users - only for dropdown population
  },

  operation: {
    perform,

    inputFields: [],

    sample: {
      id: 'team_abc123',
      name: 'My Company',
      slug: 'my-company',
      isPersonal: false,
      role: 'owner',
    },

    outputFields: [
      { key: 'id', label: 'Team ID', type: 'string' },
      { key: 'name', label: 'Team Name', type: 'string' },
      { key: 'slug', label: 'Slug', type: 'string' },
      { key: 'isPersonal', label: 'Is Personal Team', type: 'boolean' },
      { key: 'role', label: 'Role', type: 'string' },
    ],
  },
};
