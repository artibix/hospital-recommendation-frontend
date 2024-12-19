export function formatDistance(distance: number): string {
    if (distance < 1) {
        return `${(distance * 1000).toFixed(0)}m`
    }
    return `${distance.toFixed(1)}km`
}