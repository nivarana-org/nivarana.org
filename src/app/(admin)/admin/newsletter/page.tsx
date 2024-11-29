import { getSubscribers } from "@/data/cms";
import { Table } from "@mui/joy";

export default async function Page() {
    const subscribers = await getSubscribers();
    return <><Table sx={{ '& thead :first-child': { width: '10%' } }}>
        <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody>
            {subscribers.map((row) => <tr key={row.id}><td>{row.id}</td><td>{row.user_email}</td></tr>)}
        </tbody>
    </Table></>
}