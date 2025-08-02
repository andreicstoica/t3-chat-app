"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  ArrowLeft,
  User,
  Mail,
  LogOut,
  Settings as SettingsIcon,
  Save,
  Cpu,
  Key,
  Trash2,
} from "lucide-react";
import { signOut, authClient } from "~/lib/auth-client";
import { useModel } from "~/lib/model-context";
import { api } from "~/trpc/react";
import ControlledSelect from "./ControlledSelect";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

interface SettingsPageContentProps {
  user: User;
}

export function SettingsPageContent({ user }: SettingsPageContentProps) {
  const router = useRouter();
  const { selectedModel, setSelectedModel } = useModel();
  const [email, setEmail] = useState(user.email);
  const [emailError, setEmailError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // tRPC mutations
  const updateEmailMutation = api.profile.updateEmail.useMutation({
    onSuccess: () => {
      setEmailError("");
      // Show success alert and sign out
      alert(
        "Email updated successfully! You will now be signed out to verify your new email address.",
      );
      void signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
          },
        },
      });
    },
    onError: (error) => {
      setEmailError(error.message);
    },
  });

  const deleteAccountMutation = api.profile.deleteAccount.useMutation({
    onSuccess: () => {
      void signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/");
          },
        },
      });
    },
    onError: (error) => {
      setDeleteError(error.message);
    },
  });

  const handleEmailUpdate = async () => {
    setEmailError("");

    if (email === user.email) {
      setEmailError("New email must be different from current email");
      return;
    }

    if (!email.trim()) {
      setEmailError("Email address cannot be empty");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    await updateEmailMutation.mutateAsync({
      email: email.toLowerCase().trim(),
    });
  };

  const handlePasswordChange = async () => {
    setPasswordError("");

    if (!currentPassword.trim()) {
      setPasswordError("Current password is required");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        if (result.error.message?.includes("Invalid password")) {
          setPasswordError("Current password is incorrect");
        } else {
          setPasswordError(result.error.message || "Failed to change password");
        }
      } else {
        alert(
          "Password changed successfully! You will now be signed out. Please sign in with your new password.",
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Better Auth with revokeOtherSessions handles session invalidation automatically
        // The session will be revoked and useSession will update reactively
        router.replace("/");
      }
    } catch (error) {
      setPasswordError("Failed to change password");
      console.error("Password change error:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE MY ACCOUNT") {
      setDeleteError("Please type 'DELETE MY ACCOUNT' exactly to confirm");
      return;
    }

    // Additional confirmation dialog
    const confirmed = confirm(
      "Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your data including chat history.",
    );

    if (!confirmed) {
      return;
    }

    setDeleteError("");

    try {
      await deleteAccountMutation.mutateAsync({
        confirmationText: "DELETE MY ACCOUNT",
      });
    } catch {
      // Error handled by mutation
    }
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/");
        },
      },
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back to Chat
        </Button>
      </div>

      {/* Model Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="-mt-0.5 h-5 w-5" />
            <div>
              <div>AI Model Selection</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="pl-1" htmlFor="model">
              Default Model
            </Label>
            <ControlledSelect
              value={selectedModel}
              onValueChange={setSelectedModel}
            />
            <p className="text-muted-foreground text-s1 pl-1">
              Choose the AI model that will be used for your conversations. This
              setting applies to all new chats.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="-mt-0.5 h-5 w-5" />
            <div>
              <div>Account Information</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">
                Display Name
              </Label>
              <p className="text-sm font-medium">{user.name || "Not set"}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">
                Member Since
              </Label>
              <p className="text-sm">{formatDate(user.createdAt)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">
                Account ID
              </Label>
              <p className="font-mono text-xs">{user.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">
                Email Verified
              </Label>
              <p className="text-sm">{user.emailVerified ? "Yes" : "No"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="-mt-0.5 h-5 w-5" />
            <div>
              <div>Email Settings</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="pl-1" htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              type="email"
              placeholder="Enter your email address"
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">{emailError}</p>
            )}
            <p className="text-muted-foreground pl-1 text-sm">
              Changing your email will require re-verification and you will be
              signed out
            </p>
          </div>

          <div className="flex justify-start pl-1">
            <Button
              onClick={handleEmailUpdate}
              disabled={email === user.email || updateEmailMutation.isPending}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {updateEmailMutation.isPending ? "Updating..." : "Update Email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="-mt-0.5 h-5 w-5" />
            <div>
              <div>Password Settings</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Enter current password"
                className={passwordError ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Enter new password (minimum 8 characters)"
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Confirm new password"
                className={passwordError ? "border-red-500" : ""}
              />
              <p className="text-muted-foreground pl-1 text-sm">
                Changing your password will sign you out and require you to sign
                in again
              </p>
            </div>
          </div>

          <div className="flex justify-start">
            <Button
              onClick={handlePasswordChange}
              disabled={!currentPassword || !newPassword || !confirmPassword}
              className="gap-2"
            >
              <Key className="h-4 w-4" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="-mt-0.5 h-5 w-5" />
            <div>Sign Out</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              Sign out of your account. You&apos;ll need to sign in again to
              access your chats.
            </p>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-xl text-red-600">
            <div>Danger Zone</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Delete Account */}
          <div className="space-y-2 border-t pt-6">
            <h3 className="text-sm font-medium text-red-600">Delete Account</h3>
            <p className="text-muted-foreground text-sm">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <div className="space-y-2">
              <Label htmlFor="deleteConfirmation">
                Type &quot;DELETE MY ACCOUNT&quot; to confirm
              </Label>
              <Input
                id="deleteConfirmation"
                value={deleteConfirmation}
                onChange={(e) => {
                  setDeleteConfirmation(e.target.value);
                  setDeleteError("");
                }}
                placeholder="DELETE MY ACCOUNT"
                className={`max-w-xs ${deleteError ? "border-red-500" : ""}`}
              />
              {deleteError && (
                <p className="mt-1 text-sm text-red-600">{deleteError}</p>
              )}
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={
                deleteConfirmation !== "DELETE MY ACCOUNT" ||
                deleteAccountMutation.isPending
              }
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleteAccountMutation.isPending
                ? "Deleting..."
                : "Delete Account"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
