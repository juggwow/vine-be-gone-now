'use client'

import { Snackbar, Alert } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import { AlertColor } from "@mui/material";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
  useCallback,
  Suspense
} from "react";

type AlertSnackBarType = {
  open: boolean;
  sevirity: AlertColor;
  message: string;
};

type SetPropsAlertSnackBar = {
  snackBar: AlertSnackBarType;
  setSnackBar: Dispatch<SetStateAction<AlertSnackBarType>>;
};

type SetPropsLoadingBackDrop = {
  progress: boolean;
};

type AlertAndLoadingContextType = {
  loading: (isLoad: boolean) => void;
  alert: (msg: string, sevirity: AlertColor) => void;
};

const AlertAndLoadingContext = createContext<
  AlertAndLoadingContextType | undefined
>(undefined);

export function AlertAndLoading({ children }: { children: ReactNode }) {
  const [snackBar, setSnackBar] = useState<AlertSnackBarType>({
    open: false,
    sevirity: "success",
    message: "",
  });
  const [progress, setProgress] = useState(false);
  const loading = useCallback((isLoaded: boolean) => {
    setProgress(isLoaded);
  }, []);
  const alert = useCallback((message: string, sevirity: AlertColor) => {
    setSnackBar({
      open: true,
      message,
      sevirity,
    });
  }, []);

  return (
    <Suspense>
      <AlertAndLoadingContext.Provider value={{ loading, alert }}>
        {children}
        <AlertSnackBar snackBar={snackBar} setSnackBar={setSnackBar} />
        <LoadingBackDrop progress={progress} />
      </AlertAndLoadingContext.Provider>
    </Suspense>
  );
}

function AlertSnackBar({ snackBar, setSnackBar }: SetPropsAlertSnackBar) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={snackBar.open}
      autoHideDuration={2000}
      onClose={() => setSnackBar({ ...snackBar, open: false })}
    >
      <Alert
        severity={snackBar.sevirity}
        onClose={() => setSnackBar({ ...snackBar, open: false })}
      >
        {snackBar.message}
      </Alert>
    </Snackbar>
  );
}

function LoadingBackDrop({ progress }: SetPropsLoadingBackDrop) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={progress}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export function useAlertLoading() {
  const context = useContext(AlertAndLoadingContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
}
