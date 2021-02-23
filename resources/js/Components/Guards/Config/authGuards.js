import Auth from 'Components/Guards/Auth';
import Guest from 'Components/Guards/Guest';
import TwoFactorVerified from 'Components/Guards/TwoFactorVerified';
import TwoFactorUnverified from 'Components/Guards/TwoFactorUnverified';
import HasScope from 'Components/Guards/HasScope';

export default {
    'auth': Auth,
    'guest': Guest,
    'two-factor-verified': TwoFactorVerified,
    'two-factor-unverified': TwoFactorUnverified,
    'has-scope': HasScope
};
