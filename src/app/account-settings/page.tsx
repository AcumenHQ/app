"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { usePrivy } from "@privy-io/react-auth";
import { CopyAddress } from "@/components/CopyAddress";
import Link from "next/link";

export default function AccountSettingsPage() {
  const { profile, isLoadingProfile, updateProfile } = useUserStore();
  const { authenticated, user } = usePrivy();
  const address = user?.wallet?.address || profile?.virtualAddress;
  const isConnected = authenticated;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "profile" | "email" | "password"
  >("profile");

  // Form states
  const [profileForm, setProfileForm] = useState({
    displayName: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    twitter: "",
    discord: "",
  });

  const [emailForm, setEmailForm] = useState({
    currentEmail: "",
    newEmail: "",
    confirmEmail: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        displayName: profile.displayName || "",
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        twitter: profile.twitter || "",
        discord: profile.discord || "",
      });
      setEmailForm((prev) => ({
        ...prev,
        currentEmail: address || profile.address || "", // Using connected wallet address as email placeholder
      }));
    }
  }, [profile, address]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      await updateProfile({
        ...profileForm,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailForm.newEmail !== emailForm.confirmEmail) {
      alert("New email addresses do not match");
      return;
    }
    alert(
      "Email change functionality will be implemented with backend integration",
    );
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    alert(
      "Password change functionality will be implemented with backend integration",
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <nav className="space-y-2">
              {[
                { id: "profile", label: "Profile Information", icon: "👤" },
                { id: "email", label: "Email Settings", icon: "✉️" },
                { id: "password", label: "Password Settings", icon: "🔒" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setActiveSection(item.id as typeof activeSection)
                  }
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {activeSection === "profile" && (
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form to original values
                          if (profile) {
                            setProfileForm({
                              displayName: profile.displayName || "",
                              username: profile.username || "",
                              bio: profile.bio || "",
                              location: profile.location || "",
                              website: profile.website || "",
                              twitter: profile.twitter || "",
                              discord: profile.discord || "",
                            });
                          }
                        }}
                        className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        disabled={isSaving}
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.displayName}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            displayName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            website: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={profileForm.twitter}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            twitter: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="@twitter_handle"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Discord
                      </label>
                      <input
                        type="text"
                        value={profileForm.discord}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            discord: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="username#1234"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Wallet Address</h3>
                        <p className="text-sm text-muted-foreground">
                          Your connected wallet address
                        </p>
                      </div>
                      <div>
                        {(address && isConnected) || profile?.address ? (
                          <CopyAddress
                            address={
                              address && isConnected
                                ? address
                                : profile?.address || ""
                            }
                            className="text-muted-foreground"
                            iconSize="md"
                          />
                        ) : (
                          <span className="text-sm font-mono text-muted-foreground">
                            Not connected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "email" && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold mb-6">Email Settings</h2>

                <form onSubmit={handleEmailChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Email
                    </label>
                    <input
                      type="email"
                      value={emailForm.currentEmail}
                      disabled
                      className="w-full px-3 py-2 border border-input rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                      placeholder="No email linked (using wallet address)"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Currently using connected wallet address for
                      identification
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Email Address
                    </label>
                    <input
                      type="email"
                      value={emailForm.newEmail}
                      onChange={(e) =>
                        setEmailForm((prev) => ({
                          ...prev,
                          newEmail: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter new email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Email
                    </label>
                    <input
                      type="email"
                      value={emailForm.confirmEmail}
                      onChange={(e) =>
                        setEmailForm((prev) => ({
                          ...prev,
                          confirmEmail: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Confirm new email address"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Link Email Address
                    </button>
                  </div>
                </form>

                <div className="mt-8 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Email Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        defaultChecked
                      />
                      <span className="text-sm">
                        Market updates and predictions
                      </span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="rounded border-input"
                        defaultChecked
                      />
                      <span className="text-sm">Account security alerts</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">
                        Marketing and promotional emails
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "password" && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold mb-6">
                  Password Settings
                </h2>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Enter new password"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Password Requirements
                  </h3>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Include at least one number</li>
                    <li>• Include at least one special character</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
