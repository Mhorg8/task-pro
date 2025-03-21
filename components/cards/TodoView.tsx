"use client";
import React, { useState } from "react";
import {
  LuCheck,
  LuCheckCheck,
  LuChevronDown,
  LuChevronUp,
  LuTrash,
} from "react-icons/lu";
import { Task } from "@/types";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  changeToFinished,
  changeToInprogress,
  handleDeleteTask,
  setActiveTask,
} from "@/lib/redux/tasksSlice";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { toggleAddNewMemberModal } from "@/lib/redux/theme";
import Image from "next/image";

interface Props {
  item: Task;
}

const TodoView = ({ item }: Props) => {
  const { task, description, createdAt } = item;
  const [showCardMembers, setShowCardMembers] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Handle opening/closing the dropdown for the current card
  const handleOpenCardMembers = (id: string) => {
    setShowCardMembers((prevId) => (prevId === id ? null : id));
  };

  // Drag function to set the active task
  const handleDragStart = () => {
    dispatch(setActiveTask(item));
    setShowCardMembers(null);
  };

  async function DeleteTask(id: string) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post("/api/deleteCard", { id }, config);

    if (!response.data.isSucess) {
      toast.error(response.data.message);
    }
    dispatch(handleDeleteTask(id));
    toast.success(response.data.message);
  }

  function openAddingMemberModal(cardId: string) {
    router.push("/cards?Id=" + cardId);
    setShowCardMembers(null);
    dispatch(toggleAddNewMemberModal());
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`border-r-2 ${
        item.status === "created"
          ? "border-r-red"
          : item.status === "inprogress"
          ? "border-r-blue-400"
          : "border-r-green-500"
      }  w-full h-[200px] mt-3 border border-zinc-200 flex flex-col items-start justify-between
       hover:bg-zinc-200/80 dark:hover:bg-zinc-200/10 hoverEffect py-5 px-4 cursor-grab relative`}
    >
      <div className="flex items-center justify-between w-full">
        <h3 className="line-clamp-1 text-lg md:text-lg lg:text-2xl font-bold flex-1">
          {task}
        </h3>
        <div className="flex items-center gap-2">
          <button>
            <LuTrash onClick={() => DeleteTask(item.id)} size={22} />
          </button>
          {item.status === "created" ? (
            <button
              className="cursor-pointer"
              onClick={() => dispatch(changeToInprogress(item.id))}
            >
              <LuCheck size={24} />
            </button>
          ) : item.status === "inprogress" ? (
            <button
              className="cursor-pointer"
              onClick={() => dispatch(changeToFinished(item.id))}
            >
              <LuCheckCheck size={24} />
            </button>
          ) : (
            <button
              className="cursor-pointer"
              onClick={() => dispatch(handleDeleteTask(item.id))}
            >
              <LuTrash size={24} />
            </button>
          )}
        </div>
      </div>
      <p className="mb-3 lg:mb-0 text-start line-clamp-2 text-sm md:text-base mt-1 dark:text-zinc-300 text-gray-700">
        {description}
      </p>
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 flex items-center justify-start relative">
          {/* Add colors or avatars for task owners */}
          {item.users.map((user) => {
            return (
              <div
                key={user.id}
                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full relative cursor-pointer bg-red hover:scale-110 hoverEffect"
              >
                <Image
                  src={user.ProfileImage ? user.ProfileImage : "/profile.jpg"}
                  alt=""
                  className="rounded-full"
                  fill
                  sizes="fill"
                />
              </div>
            );
          })}

          <button
            className="mx-3 cursor-pointer"
            onClick={() => handleOpenCardMembers(item.id)}
          >
            {showCardMembers === item.id ? (
              <LuChevronUp size={20} />
            ) : (
              <LuChevronDown size={20} />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-zinc-300">
          {createdAt.toString()}
        </p>
      </div>

      {/* Card member list */}
      {showCardMembers === item.id && (
        <div className="absolute top-full left-5 bg-black/70 max-w-[330px] text-white h-fit min-w-60  flex flex-col items-center justify-between rounded-sm -mt-2 dark:bg-white dark:text-black z-10">
          <div className="flex items-start gap-2 justify-between w-full hover:bg-black/10 p-2">
            <div className="h-12 w-12 rounded-full bg-red"></div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">Mohammad</h4>
              <p className="truncate">mohammadalirezaie081@gmail.com</p>
            </div>
          </div>

          {/* Adding new member button */}
          <button
            className="w-full mt-2 cursor-pointer py-2 dark:bg-zinc-300 bg-black/50 rounded-b-sm font-semibold"
            onClick={() => openAddingMemberModal(item.id)}
          >
            Add new member
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoView;
