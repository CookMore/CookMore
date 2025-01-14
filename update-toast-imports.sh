#!/bin/bash

files=(
    "src/app/(authenticated)/admin/components/RoleManager.tsx"
    "src/app/(authenticated)/admin/components/ProfileManager.tsx"
    "src/app/(authenticated)/admin/components/DeletedProfiles.tsx"
    "src/app/(authenticated)/admin/components/NFTManager.tsx"
    "src/app/(authenticated)/profile/components/forms/FreeProfileForm.tsx"
    "src/app/(authenticated)/profile/components/forms/CreateProfileForm.tsx"
    "src/app/(authenticated)/profile/components/forms/ProProfileForm.tsx"
    "src/app/(authenticated)/profile/components/modals/ProfileMintModal.tsx"
    "src/app/(authenticated)/profile/components/editor/ProfileTypeSwitcher.tsx"
    "src/app/(authenticated)/profile/create/actions.ts"
    "src/app/(authenticated)/kitchen/hooks/useRecipeAI.ts"
    "src/components/ui/TierBadge.tsx"
    "src/components/ui/toaster.tsx"
    "src/components/dapps/tier/TierMintDapp.tsx"
    "src/lib/auth/hooks/useAccessControl.ts"
    "src/lib/auth/hooks/useProfile.ts"
    "src/lib/web3/hooks/useProfileRegistry.ts"
    "src/lib/web3/hooks/useMetadataContract.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        # Update to use the new centralized toast imports
        sed -i '' 's|@/lib/ui/use-toast|@/lib/ui/toast|g' "$file"
        sed -i '' 's|@/components/ui/use-toast|@/lib/ui/toast|g' "$file"
        echo "Updated $file"
    else
        echo "File not found: $file"
    fi
done
