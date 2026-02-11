import { Collapse, Dropdown } from 'bootstrap';

export default defineNuxtPlugin(() => {
    // Bootstrap JS modules are auto-initialized via data attributes
    // We just need to import the modules we use:
    // - Collapse: for navbar toggler
    // - Dropdown: for user menu dropdown

    return {
        provide: {
            bootstrap: {
                Collapse,
                Dropdown
            }
        }
    }
});
