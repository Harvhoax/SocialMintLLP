import Landing from '@/components/Landing';
import StructuredData from '@/components/StructuredData';
import { businessSchema } from '@/lib/business-schema';
import Discovery from '@/components/Discovery';
export default function Page() { return <><StructuredData data={businessSchema()} /><Landing discovery={<Discovery />} /></>; }
