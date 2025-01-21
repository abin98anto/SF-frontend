import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppRootState, AppDispatch } from "../redux/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;
