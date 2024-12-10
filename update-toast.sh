#!/bin/bash

# Function to update file content
update_file() {
    local file=$1
    # Replace useToast import and usage with direct sonner toast
    sed -i '' \
        -e 's/import { useToast } from.*$/import { toast } from '\''sonner'\''/' \
        -e 's/const { toast } = useToast()//' \
        -e 's/toast({.*title:.*'\''Error'\'',.*description: \(.*\).*})/toast.error(\1)/' \
        -e 's/toast({.*title:.*'\''Success'\'',.*description: \(.*\).*})/toast.success(\1)/' \
        -e 's/toast({.*description: \(.*\).*})/toast.info(\1)/' \
        "$file"
}

# Update all files
files=(
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
    "src/components/dapps/tier/TierMintDapp.tsx"
    "src/lib/auth/hooks/useAccessControl.ts"
    "src/lib/auth/hooks/useProfile.ts"
    "src/lib/web3/hooks/useProfileRegistry.ts"
    "src/lib/web3/hooks/useMetadataContract.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        update_file "$file"
    else
        echo "Warning: $file not found"
    fi
done
