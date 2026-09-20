import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  PeekableProvider,
  PeekableSidebarProvider,
  PeekPane,
  useSidebarMouseListener,
} from "@/components/base/sidebar";
import { AppSidebar, PeekPaneBody } from "@/pages/workspace/components/app-sidebar";

function MouseListener() {
  useSidebarMouseListener();
  return null;
}

function Content() {
  return (
    <SidebarInset className="h-svh max-h-svh min-w-0 overflow-x-hidden">
      <Outlet />
    </SidebarInset>
  );
}

export default function WorkspaceLayout() {
  return (
    <PeekableProvider>
      <PeekableSidebarProvider>
        <AppSidebar />
        <PeekPane>
          <PeekPaneBody />
        </PeekPane>
        <Content />
        <MouseListener />
      </PeekableSidebarProvider>
    </PeekableProvider>
  );
}
