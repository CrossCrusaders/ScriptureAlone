export interface Version {
    id?: string
    created?: Date
    updated?: Date
    collectionId?: string
    collectionName?: string

    title?: string
    description?: string
    releaseDate?: Date
    version?: number
    platforms?: string[]
}


export const transformVersionResponse = (response: any): Version => {
    const version: Version = {
        ...response,
        collectionId: response['@collectionId'],
        collectionName: response['@collectionName'],
    }

    if (version.updated)
        version.updated = new Date((version.updated as any).replace(' ', 'T'))

    if (version.created)
        version.created = new Date((version.created as any).replace(' ', 'T'))

    return version
}

export const transformVersionResponses = (responses: any[]) =>
    responses.map(r => transformVersionResponse(r))

