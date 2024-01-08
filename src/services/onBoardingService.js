import util from "../util/util";
export default class OnboardingService {
    async signingUp(data) {
        try {
            return await util.sendApiRequest("/create-account", "POST", true, data);
        } catch (error) {
            throw error
        }
    }

    async signingUpAuth(data) {
        try {
            return await util.sendApiRequest("/update_password_auth", "POST", true, data);
        } catch (error) {
            throw error
        }
    }

    async emailVerification(data) {
        try {
            return await util.sendApiRequest("/verify-email", "POST", true, data);
        } catch (error) {
            throw error
        }
    }

    async resendemailVerification(data) {
        try {
            return await util.sendApiRequest("/resend-email", "POST", true, data)
        } catch (error) {
            throw error
        }
    }

    async updatePassword(data) {
        try {
            return await util.sendApiRequest("/password-update", "POST", true, data)
        } catch (error) {
            throw error
        }
    }

    async updateUsername(data) {
        try {
            return await util.sendApiRequest("/update-username", "POST", true, data)
        }
        catch (error) {
            throw error
        }
    }

    async changeEmail(data) {
        try {
            return await util.sendApiRequest("/change-email", "POST", true, data);
        } catch (error) {
            throw error
        }
    }

    async updateBio(data) {
        try {
            return await util.sendApiRequest("/update-bio", "POST", true, data);
        }
        catch (error) {
            throw error
        }
    }

    async updateProfileImage(data) {
        try {
            return await util.sendApiRequest("/update-profileimage", "POST", true, data);
        }
        catch (error) {
            throw error
        }
    }

    async signupGmail(data) {
        try {
            return await util.sendApiRequest("/google_signup", "POST", true, data);
        }
        catch (error) {
            throw error
        }
    }

    async skioOnboarding(id, data) {
        try {
            return await util.sendApiRequest(`/skip_onboardingsteps?id=${id}`, "POST", true, data);
        }
        catch (error) {
            throw error
        }
    }

    async usernameSuggestions(username) {
        try {
            return await util.sendApiRequest(`/usersuggestions`, "POST", true, { username: username })
        }
        catch (error) {
            throw error
        }
    }
}