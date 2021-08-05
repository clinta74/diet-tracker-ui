export const getIconMetadata = (metadata: Metadata[]) => {
    const iconName = metadata.find(m => m.key === 'IconName')?.value || '';
    const count = Number(metadata.find(m => m.key === 'Count')?.value) || 0;

    return {
        iconName,
        count,
    }
}