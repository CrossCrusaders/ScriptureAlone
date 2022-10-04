import PocketBaseClient from '../../api/PocketBaseClient'

export const getAttachmentUrl = (record:any, type:any) => {
  if(type == "devotional"){
    return PocketBaseClient.records.getFileUrl(record, record.coverImage, {});
  }
  else if(type == "sermon"){
    return PocketBaseClient.records.getFileUrl(record, record.author.profileImage, {});
  }
  else if(type == "author"){
    return PocketBaseClient.records.getFileUrl(record, record.profileImage, {});
  }
}