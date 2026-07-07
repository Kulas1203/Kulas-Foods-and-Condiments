import { AdminTopbar } from "@/components/admin/topbar";
import { MediaLibrary } from "@/components/admin/media-library";

export const metadata = { title: "Media Library" };

export default function AdminMediaPage() {
  return (
    <div>
      <AdminTopbar title="Media Library" />
      <div className="p-6">
        <MediaLibrary />
      </div>
    </div>
  );
}
