'use strict';

// Configuring the Articles module
angular.module('lists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Lists', 'lists', 'dropdown', '/lists(/create)?');
		Menus.addSubMenuItem('topbar', 'lists', 'List Lists', 'lists');
		Menus.addSubMenuItem('topbar', 'lists', 'New List', 'lists/create');
	}
]);