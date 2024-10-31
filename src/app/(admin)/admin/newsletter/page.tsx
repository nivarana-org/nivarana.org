import { getSubscribers } from "@/data/cms";

export default async function Page() {
    const subscribers = await getSubscribers();
    return <><table>
        <thead>
            <tr>
                <td>ID</td>
                <td>Email</td>
            </tr>
        </thead>
        <tbody>
            {subscribers.map((row) => <tr key={row.id}><td>{row.id}</td><td>{row.user_email}</td></tr>)}
        </tbody>
    </table></>
}