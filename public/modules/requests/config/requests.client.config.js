'use strict';

// Configuring the Articles module
angular.module('requests').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Requests', 'requests', 'dropdown', '/requests(/create)?');
		Menus.addSubMenuItem('topbar', 'requests', 'List Requests', 'requests');
		Menus.addSubMenuItem('topbar', 'requests', 'New Request', 'requests/create');
	}
]);