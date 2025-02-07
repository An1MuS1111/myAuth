import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Shield, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function Profile() {
    // Placeholder data - in a real app, this would come from your state or API
    const userEmail = "john.doe@example.com";
    const userName = "John Doe";
    const accountType = "Premium";
    const devices = [
        {
            name: "iPhone 12",
            lastActive: "2023-05-15 10:30 AM",
            location: "New York, USA",
        },
        {
            name: "MacBook Pro",
            lastActive: "2023-05-14 3:45 PM",
            location: "New York, USA",
        },
        {
            name: "iPad Air",
            lastActive: "2023-05-10 9:15 AM",
            location: "Boston, USA",
        },
    ];

    const navigate = useNavigate();

    const handleLogoutAllDevices = () => {
        // Implement logout logic here
        console.log("Logging out of all devices");
        navigate("/blank");
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold flex items-center gap-2">
                        <UserCircle className="h-8 w-8" />
                        My Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Welcome back, {userName}! Here you can view and manage
                        your account information and connected devices.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                            <Shield className="h-6 w-6" />
                            Account Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">Email</h3>
                            <p className="text-muted-foreground">{userEmail}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Name</h3>
                            <p className="text-muted-foreground">{userName}</p>
                        </div>
                        {/* <div>
                            <h3 className="text-lg font-medium">
                                Account Type
                            </h3>
                            <Badge variant="secondary">{accountType}</Badge>
                        </div> */}
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                            <Bell className="h-6 w-6" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Manage your notification preferences to stay updated
                            on account activity and security alerts.
                        </p>
                        <Button variant="outline">Manage Notifications</Button>
                    </CardContent>
                </Card> */}
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        Connected Devices
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-muted-foreground">
                            These are the devices that are currently logged into
                            your account.
                            <br />
                            For security, log out of any devices you don't
                            recognize.
                        </p>
                        <Button
                            onClick={handleLogoutAllDevices}
                            variant="destructive"
                        >
                            Log out of all devices
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Device Name</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devices.map((device, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">
                                        {device.name}
                                    </TableCell>
                                    <TableCell>{device.lastActive}</TableCell>
                                    <TableCell>{device.location}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
