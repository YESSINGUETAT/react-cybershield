export function applyCyberShieldToAxios(axiosInstance) {
    axiosInstance.interceptors.request.use((config) => {
        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && (error.response.status === 403 || error.response.status === 429)) {
                const data = error.response.data;
                if (data && data.blocked && data.redirect) {
                    window.location.assign(data.redirect);
                }
            }
            return Promise.reject(error);
        }
    );
}


(function initCyberShieldInterceptor() {
    if (typeof window === 'undefined' || !window.fetch) return;


    // ------------------------------

    // Prevent multiple initializations
    if (window.__cybershield_initialized) return;
    window.__cybershield_initialized = true;

    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        let [resource, config] = args;
        config = config || {};

        try {
            const response = await originalFetch(resource, config);

            if (response.status === 403 || response.status === 429) {
                const clonedResponse = response.clone();
                try {
                    const data = await clonedResponse.json();
                    if (data && data.blocked && data.redirect) {
                        window.location.assign(data.redirect);
                    }
                } catch (e) { }
            }
            return response;
        } catch (error) {
            throw error;
        }
    };
})();
