const MixPanel = require('react-native-mixpanel');

class Mixpanel {
    constructor() {
      this.mixpanel = callback => MixPanel.default.sharedInstanceWithToken("ac3d693217465fc6d98907993809d951")
        .then(() => callback())
        .catch(error => console.log('Failed to initialize Mixpanel: ', error));
    }

    regUniqueId = async (id) => {
        this.mixpanel(() => 
            MixPanel.default.identify(id)
        );
    };

    setValue = async (setValues) => {
        this.mixpanel(() => 
            MixPanel.default.set(setValues)
        );
    };
  
    trackEvent = async (eventName) => {
        this.mixpanel(() =>
            MixPanel.default.track(eventName)
        );
    };
  }
  
  export default new Mixpanel();