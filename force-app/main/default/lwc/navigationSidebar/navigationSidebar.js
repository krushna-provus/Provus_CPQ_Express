import { LightningElement, track } from 'lwc';

export default class NavigationSidebar extends LightningElement {

    isOpen = true;
    activeItem = 'dashboard';

    // @track needed here because we mutate nested object properties
    @track menuItems = [
        { id: 'dashboard', label: 'Dashboard',       icon: 'standard:home',        route: 'dashboard',  computedClass: 'menu-btn active' },
        { id: 'accounts',  label: 'Accounts',        icon: 'standard:account',     route: 'accounts',   computedClass: 'menu-btn' },
        { id: 'quotes',    label: 'Quotes',          icon: 'standard:quote',       route: 'quotes',     computedClass: 'menu-btn' },
        { id: 'products',  label: 'Products',        icon: 'standard:product',     route: 'products',   computedClass: 'menu-btn' },
        { id: 'resources', label: 'Resource Roles',  icon: 'standard:people',      route: 'resources',  computedClass: 'menu-btn' },
        { id: 'addons',    label: 'Add-ons',         icon: 'standard:opportunity', route: 'addons',     computedClass: 'menu-btn' }
    ];

    // @track needed here too — settingsItem.computedClass is mutated
    @track settingsItem = {
        id: 'settings',
        label: 'Settings',
        icon: 'utility:settings',   // FIX: 'standard:settings' does not exist
        route: 'settings',
        computedClass: 'menu-btn'
    };

    get sidebarClass() {
        return this.isOpen ? 'sidebar sidebar-open' : 'sidebar sidebar-closed';
    }

    // FIX: replace duplicate class + class:rotated with a single computed class getter
    get toggleButtonClass() {
        return this.isOpen ? 'toggle-button' : 'toggle-button rotated';
    }

    // FIX: swap icon direction based on open/closed state
    get toggleIcon() {
        return this.isOpen ? 'utility:chevronleft' : 'utility:chevronright';
    }

    get toggleTitle() {
        return this.isOpen ? 'Collapse sidebar' : 'Expand sidebar';
    }

    toggleSidebar() {
        this.isOpen = !this.isOpen;
    }

    handleMenuClick(e) {
        const itemId = e.currentTarget.dataset.itemId;
        this.activeItem = itemId;
        this._updateComputedClasses();         // FIX: recompute classes after selection

        this.dispatchEvent(new CustomEvent('itemselected', {
            detail: { itemId, route: this.getRouteById(itemId) }
        }));
    }

    // FIX: drive active styling from data, not template method calls
    _updateComputedClasses() {
        this.menuItems = this.menuItems.map(item => ({
            ...item,
            computedClass: 'menu-btn' + (item.id === this.activeItem ? ' active' : '')
        }));
        this.settingsItem = {
            ...this.settingsItem,
            computedClass: 'menu-btn' + (this.settingsItem.id === this.activeItem ? ' active' : '')
        };
    }

    getRouteById(itemId) {
        const item = this.menuItems.find(m => m.id === itemId);
        if (item) return item.route;
        return this.settingsItem.id === itemId ? this.settingsItem.route : null;
    }
}