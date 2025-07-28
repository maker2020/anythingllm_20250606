const prisma = require("../utils/prisma");
const { FolderUser } = require("./folder_users");
const { ROLES } = require("../utils/middleware/multiUserProtected");

const Folder = {

  async new(foldername, creatorId=null) {
    try {
      const folder=await this.create({
        folder_name: foldername,
        createdby_userid: creatorId || 0,
      });

      if (!!creatorId) await FolderUser.create({
        user_id: creatorId,
        folder_id: folder.id
      });

      return { folder, message: null };
    } catch (error) {
      console.error(error.message);
      return { folder: null, message: error.message };
    }
  },

  updateUsers: async function (folderId, userIds = []) {
    try {
      await FolderUser.delete({ folder_id: Number(folderId) });
      await FolderUser.createManyUsers(userIds, folderId);
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  whereWithUsers: async function (clause = {}, limit = null, orderBy = null, user=null) {
    try {
      const folders = await this.where(clause, limit, orderBy);
      const filteredFolders = [];
      for (const folder of folders) {
        const userIds = (
            await FolderUser.where({ folder_id: Number(folder.id) })
          ).map((rel) => rel.user_id);
        folder.userIds = userIds;

        if(user.role===ROLES.manager){
          const folderUser = await FolderUser.findOne({folder_id: folder.id, user_id: user.id});
          if(folderUser){
            filteredFolders.push(folder);
          }
        }else if(user.role===ROLES.admin){
          filteredFolders.push(folder);
        }

      }
      return filteredFolders;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.folder.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  // 创建新记录
  async create(data) {
    return await prisma.folder.create({ data });
  },

  // 查询所有记录
  async findAll(where = {}) {
    return await prisma.folder.findMany({ where });
  },

  // 查询单条记录
  async findOne(where) {
    return await prisma.folder.findFirst({ where });
  },

  // 更新记录
  async update(id, data) {
    return await prisma.folder.update({
      where: { id },
      data,
    });
  },

  // 删除记录
  async remove(id) {
    return await prisma.folder.delete({
      where: { id },
    });
  },

  async findByCreatedUserId(userId) {
    return await prisma.folder.findMany({
      where: { createdby_userid: userId },
    });
  },

  async findByFolderId(folderId){
    return await prisma.folder.findFirst({
      where: { id: folderId }
    });
  },

  async findByFolderName(name){
    return await prisma.folder.findFirst({
      where: { folder_name: name }
    });
  },

  async findByUserId(userId){
    try {
      const results = await prisma.folder_users.findMany({
        where: { user_id: userId }
      });
      return await Promise.all(results.map(async (item) => {
        return await this.findByFolderId(item.folder_id);
      }));
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }
};

module.exports = { Folder };