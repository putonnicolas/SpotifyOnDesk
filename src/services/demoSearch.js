/**
 * Search tracks using the public Apple Music / iTunes Search API.
 * Free, zero auth keys required, CORS-enabled for live web use.
 */
export async function searchDemoTracks(query) {
  if (!query || query.trim().length === 0) return []

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      query.trim()
    )}&entity=song&limit=8`
    const response = await fetch(url)
    if (!response.ok) return []

    const data = await response.json()
    return (data.results || []).map((track) => {
      // Get 600x600 high resolution artwork
      const artwork = track.artworkUrl100
        ? track.artworkUrl100.replace('100x100bb', '600x600bb')
        : ''

      // Generate a deterministic aesthetic energy score for the 3D perlin noise
      const hash = `${track.trackName || ''}${track.artistName || ''}`
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const energy = 0.35 + (hash % 55) / 100

      return {
        id: `itunes-${track.trackId}`,
        item: {
          id: `track-${track.trackId}`,
          name: track.trackName || 'Unknown Title',
          artists: [
            {
              id: `artist-${track.artistId || track.artistName}`,
              name: track.artistName || 'Unknown Artist',
            },
          ],
          album: {
            name: track.collectionName || track.trackName || '',
            images: [{ url: artwork }],
          },
          duration_ms: track.trackTimeMillis || 180000,
        },
        progress_ms: 15000,
        artistImage: { url: artwork },
        energy,
      }
    })
  } catch (err) {
    console.warn('Failed to search demo tracks:', err)
    return []
  }
}
