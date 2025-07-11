import { useRef } from "react";
import Admin from "@/models/admin";
import paths from "@/utils/paths";
import { LinkSimple, Trash } from "@phosphor-icons/react";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import AddFolderMemberModal from "./AddFolderMemberModal";

export default function FoldersRow({ folder, users }) {
  const { isOpen, openModal, closeModal } = useModal();

  const rowRef = useRef(null);
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${folder.folder_name}?\nAfter you do this it will be unavailable in this instance of AnythingLLM.\n\nThis action is irreversible.`
      )
    )
      return false;
    rowRef?.current?.remove();
    await Admin.deleteFolder(folder.id);
  };

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10"
      >
        <th scope="row" className="px-6 whitespace-nowrap">
          {folder.folder_name}
        </th>
        <td className="px-6">
          <a
            href="javascript:void(0)"
            onClick={openModal}
            className="text-white flex items-center underline"
          >
            {folder.userIds?.length}
          </a>
          <ModalWrapper isOpen={isOpen}>
              <AddFolderMemberModal
                closeModal={closeModal}
                users={users}
                folder={folder}
              />
          </ModalWrapper>
        </td>
        <td className="px-6">{folder.createdAt}</td>
        <td className="px-6 flex items-center gap-x-6 h-full mt-1">
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
    </>
  );
}
