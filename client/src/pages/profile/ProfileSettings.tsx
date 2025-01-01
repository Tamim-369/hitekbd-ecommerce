import React from 'react'
import Input from '../../components/Input'

interface SettingsProps {
    handlePasswordSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    passwordError: string | null;
    passwordSuccess: string | null;
    passwords: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    };
    handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isChangingPassword: boolean;
}

function ProfileSettings({
    handlePasswordSubmit,
    passwordError,
    passwordSuccess,
    passwords,
    handlePasswordChange,
    isChangingPassword
}: SettingsProps) {
    return (
        <>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Account Settings
                </h2>
                <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Password
                        </h3>
                        {passwordError && (
                            <div className="text-red-600 mb-4">{passwordError}</div>
                        )}
                        {passwordSuccess && (
                            <div className="text-green-600 mb-4">{passwordSuccess}</div>
                        )}
                        <div className="space-y-4">
                            <Input
                                label="Current Password"
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handlePasswordChange}
                            />
                            <Input
                                label="New Password"
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                            />
                            <Input
                                label="Confirm New Password"
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div className="mt-4">
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                            >
                                {isChangingPassword
                                    ? 'Changing Password...'
                                    : 'Change Password'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ProfileSettings
