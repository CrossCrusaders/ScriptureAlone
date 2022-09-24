export interface Category {

}

export interface Sermon {
  id?: string,
  coverImage?: any,
  description?: string,
  externalAudioFileUrl?: string,
  externalCoverImageUrl?: string,
  externalVideoFileUrl?: string,
  sermonDate?: Date,
  title?: string,
  transcript?: string,
  created?: Date,
  updated?: Date
  categories?: Category[]
}

/**
"@collectionId": "2yldyph4oerppfw",
"@collectionName": "sermons",
"@expand": {
"categories": [
{
"@collectionId": "td6b1l9mrk0pshl",
"@collectionName": "sermonCategories",
"created": "2022-09-24 12:07:37.412",
"iconName": "hail",
"iconType": "",
"id": "utvvu7a1qd2e3ex",
"label": "Exhortation",
"updated": "2022-09-24 20:32:29.123"
},
{
"@collectionId": "td6b1l9mrk0pshl",
"@collectionName": "sermonCategories",
"created": "2022-09-24 12:07:20.954",
"iconName": "book",
"iconType": "",
"id": "pq9ks66fu4nje8h",
"label": "Salvation",
"updated": "2022-09-24 20:33:47.973"
}
]
},
"audioFile": "",
"author": "irtjumenw894tuu",
"categories": [
"utvvu7a1qd2e3ex",
"pq9ks66fu4nje8h"
],
"coverImage": "",
"created": "2022-09-24 12:22:07.542",
"description": "This is a description",
"externalAudioFileUrl": "https://res.cloudinary.com/scripture-alone-dev/video/upload/v1656001226/Midway%20Baptist%20Church/Harold%20MacMillian/2017.04.09.A_Christ_Liveth_In_Me_-_Harold_McMillian_-_49171540142_g6napq.mp3",
"externalCoverImageUrl": "",
"externalVideoFileUrl": "",
"id": "avww3yb67f650kx",
"sermonDate": "",
"title": "Christ Liveth In Me",
"transcript": "",
"updated": "2022-09-24 19:06:44.104"
} 

 */