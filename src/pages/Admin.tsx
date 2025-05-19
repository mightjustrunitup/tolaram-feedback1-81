import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChartBar, ChartPie, Download, Filter, Menu, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Logo from "@/components/layout/Logo";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for the admin dashboard (kept from original)
const MOCK_FEEDBACK_DATA_WITH_IMAGES = [
  { 
    id: 1, 
    customerName: "John Doe", 
    date: "2023-04-25", 
    storeLocation: "Lagos - Ikeja Mall", 
    staffFriendliness: 8, 
    cleanliness: 9, 
    productAvailability: 7, 
    overallExperience: 8, 
    comment: "Great experience overall, staff was very helpful.",
    images: [
      "https://yadcdvyzfnhjzognvqtb.supabase.co/storage/v1/object/public/feedback-images/61106a2a-3fe7-4bf7-8a44-30fe51c2dfa0_1747664157560_hot_and_spicy.jpg",
      "https://yadcdvyzfnhjzognvqtb.supabase.co/storage/v1/object/public/feedback-images/61106a2a-3fe7-4bf7-8a44-30fe51c2dfa0_1747664157560_hot_and_spicy.jpg"
    ]
  },
  { 
    id: 2, 
    customerName: "Anonymous", 
    date: "2023-04-24", 
    storeLocation: "Abuja - Wuse II", 
    staffFriendliness: 6, 
    cleanliness: 5, 
    productAvailability: 4, 
    overallExperience: 5, 
    comment: "The store was not very clean, and some products were out of stock.",
    images: []
  },
  { 
    id: 3, 
    customerName: "Sarah Johnson", 
    date: "2023-04-23", 
    storeLocation: "Lagos - Lekki Phase 1", 
    staffFriendliness: 9, 
    cleanliness: 8, 
    productAvailability: 9, 
    overallExperience: 9, 
    comment: "Excellent service, very satisfied customer.",
    images: [
      "https://yadcdvyzfnhjzognvqtb.supabase.co/storage/v1/object/public/feedback-images/61106a2a-3fe7-4bf7-8a44-30fe51c2dfa0_1747664157560_hot_and_spicy.jpg"
    ]
  },
  { 
    id: 4, 
    customerName: "Michael Brown", 
    date: "2023-04-22", 
    storeLocation: "Port Harcourt - GRA", 
    staffFriendliness: 7, 
    cleanliness: 8, 
    productAvailability: 6, 
    overallExperience: 7, 
    comment: "Good experience, but some products were missing.",
    images: []
  },
  { 
    id: 5, 
    customerName: "Anonymous", 
    date: "2023-04-21", 
    storeLocation: "Abuja - Jabi Lake Mall", 
    staffFriendliness: 5, 
    cleanliness: 6, 
    productAvailability: 7, 
    overallExperience: 6, 
    comment: "Average experience, staff could be more friendly.",
    images: [
      "https://yadcdvyzfnhjzognvqtb.supabase.co/storage/v1/object/public/feedback-images/61106a2a-3fe7-4bf7-8a44-30fe51c2dfa0_1747664157560_hot_and_spicy.jpg",
      "https://yadcdvyzfnhjzognvqtb.supabase.co/storage/v1/object/public/feedback-images/61106a2a-3fe7-4bf7-8a44-30fe51c2dfa0_1747664157560_hot_and_spicy.jpg",
      "https://yadcdvyzfnhjzognvqtb.supabase.co/storage/v1/object/public/feedback-images/61106a2a-3fe7-4bf7-8a44-30fe51c2dfa0_1747664157560_hot_and_spicy.jpg"
    ]
  },
];

// Mock data for the charts (kept from original)
const STORE_PERFORMANCE_DATA = [
  { name: "Lagos - Ikeja Mall", staffFriendliness: 8.2, cleanliness: 8.5, productAvailability: 7.8, overallExperience: 8.1 },
  { name: "Lagos - Lekki Phase 1", staffFriendliness: 8.9, cleanliness: 8.7, productAvailability: 9.1, overallExperience: 8.9 },
  { name: "Abuja - Wuse II", staffFriendliness: 7.1, cleanliness: 6.8, productAvailability: 6.5, overallExperience: 6.8 },
  { name: "Abuja - Jabi Lake Mall", staffFriendliness: 7.5, cleanliness: 7.6, productAvailability: 7.9, overallExperience: 7.7 },
  { name: "Port Harcourt - GRA", staffFriendliness: 8.0, cleanliness: 8.2, productAvailability: 7.4, overallExperience: 7.9 },
];

// Pie chart data (kept from original)
const ISSUE_DISTRIBUTION_DATA = [
  { name: "Mislabelled products", value: 15 },
  { name: "Unusual taste/odor", value: 25 },
  { name: "Texture issues", value: 20 },
  { name: "Mold or spoilage", value: 10 },
  { name: "Foreign elements", value: 5 },
  { name: "Other issues", value: 25 },
];

// Colors for the pie chart (updated to match Indomie branding)
const COLORS = ["#E51E25", "#FFC72C", "#2D2926", "#5AA9E6", "#7FC8A9", "#9F9F9F"];

export default function Admin() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  // Filter feedback data based on selected filters
  const filteredFeedback = MOCK_FEEDBACK_DATA_WITH_IMAGES.filter((feedback) => {
    const dateMatch = !startDate || !endDate || (new Date(feedback.date) >= startDate && new Date(feedback.date) <= endDate);
    const storeMatch = selectedStore === "all" || feedback.storeLocation === selectedStore;
    const searchMatch = searchTerm === "" || 
      feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return dateMatch && storeMatch && searchMatch;
  });

  const handleExportExcel = () => {
    toast.success("Exporting data to Excel...");
    // In a real app, this would trigger an API call to generate and download an Excel file
  };

  // Add a function to view images for a feedback item
  const handleViewImages = (feedback: any) => {
    setSelectedFeedback(feedback);
  };

  // Add a function to close the image viewer
  const handleCloseImageViewer = () => {
    setSelectedFeedback(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 noodle-pattern">
      {/* Mobile-friendly Header */}
      <header className="w-full bg-white border-b py-3 md:py-4 px-4 md:px-6 shadow-md fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo size={isMobile ? "sm" : "md"} />
          
          {/* Mobile Menu */}
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex-1 py-6 flex flex-col gap-4">
                    <Button 
                      variant="outline" 
                      className="justify-start" 
                      onClick={() => navigate("/home")}
                    >
                      Back to Home
                    </Button>
                    <Button 
                      variant="default"
                      className="bg-indomie-red hover:bg-indomie-red/90 justify-start"
                      onClick={() => navigate("/login")}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate("/home")}
              >
                Back to Home
              </Button>
              <Button 
                variant="default"
                className="bg-indomie-red hover:bg-indomie-red/90 relative overflow-hidden group"
                onClick={() => navigate("/login")}
              >
                <span className="relative z-10">Logout</span>
                <span className="absolute bottom-0 left-0 w-full h-0 bg-indomie-yellow transition-all duration-300 group-hover:h-full -z-0"></span>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Admin Dashboard - add padding-top for the fixed header */}
      <div className="flex-1 py-4 md:py-8 px-3 md:px-6 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Admin Dashboard</h1>
          
          <Tabs defaultValue="reports" className="space-y-4 md:space-y-6">
            <div className="overflow-x-auto pb-2">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                <TabsTrigger value="reports" className="text-sm md:text-base py-2">Reports</TabsTrigger>
                <TabsTrigger value="charts" className="text-sm md:text-base py-2">Charts</TabsTrigger>
                <TabsTrigger value="analytics" className="text-sm md:text-base py-2">Analytics</TabsTrigger>
                <TabsTrigger value="settings" className="text-sm md:text-base py-2">Settings</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-4 md:space-y-6">
              <Card className="shadow-lg border border-indomie-yellow/10 relative overflow-hidden">
                <div className="absolute inset-0 noodle-bg-light opacity-20"></div>
                <CardHeader className="relative z-10 p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Feedback Reports</CardTitle>
                  <CardDescription className="text-sm">
                    View and filter customer feedback data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10 p-4 md:p-6">
                  {/* Filters - Responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-xs md:text-sm font-medium">Start Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "default"}
                            className={cn(
                              "w-full justify-start text-left font-normal text-xs md:text-sm",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                            {startDate ? format(startDate, "PP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-xs md:text-sm font-medium">End Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size={isMobile ? "sm" : "default"}
                            className={cn(
                              "w-full justify-start text-left font-normal text-xs md:text-sm",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                            {endDate ? format(endDate, "PP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-xs md:text-sm font-medium">Store Location</label>
                      <Select 
                        value={selectedStore}
                        onValueChange={setSelectedStore}
                      >
                        <SelectTrigger className="text-xs md:text-sm h-8 md:h-10">
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Stores</SelectItem>
                          {STORE_PERFORMANCE_DATA.map((store) => (
                            <SelectItem key={store.name} value={store.name}>
                              {store.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1 md:space-y-2">
                      <label className="text-xs md:text-sm font-medium">Search</label>
                      <div className="relative">
                        <Input
                          placeholder="Search feedback..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="text-xs md:text-sm h-8 md:h-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size={isMobile ? "sm" : "default"}
                      onClick={() => {
                        setStartDate(undefined);
                        setEndDate(undefined);
                        setSelectedStore("all");
                        setSearchTerm("");
                      }}
                      className="flex items-center gap-1 text-xs md:text-sm"
                    >
                      <Filter className="h-3 w-3 md:h-4 md:w-4" />
                      Reset Filters
                    </Button>
                    
                    <Button 
                      variant="default" 
                      size={isMobile ? "sm" : "default"}
                      onClick={handleExportExcel}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                    >
                      <Download className="h-3 w-3 md:h-4 md:w-4" />
                      Export to Excel
                    </Button>
                  </div>
                  
                  {/* Responsive Feedback Table - Updated with image column */}
                  <div className="rounded-md border overflow-hidden bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Store</TableHead>
                            <TableHead className="text-center">Staff</TableHead>
                            <TableHead className="text-center">Clean</TableHead>
                            <TableHead className="text-center">Products</TableHead>
                            <TableHead className="text-center">Overall</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead className="text-center">Images</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredFeedback.map((feedback) => (
                            <TableRow key={feedback.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{feedback.customerName}</TableCell>
                              <TableCell className="whitespace-nowrap">{feedback.date}</TableCell>
                              <TableCell className="max-w-[8rem] md:max-w-none truncate">{feedback.storeLocation}</TableCell>
                              <TableCell className="text-center whitespace-nowrap">
                                <span className={cn(
                                  "px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium",
                                  feedback.staffFriendliness >= 8 ? "bg-green-100 text-green-800" :
                                  feedback.staffFriendliness >= 6 ? "bg-yellow-100 text-yellow-800" : 
                                  "bg-red-100 text-red-800"
                                )}>
                                  {feedback.staffFriendliness}
                                </span>
                              </TableCell>
                              <TableCell className="text-center whitespace-nowrap">
                                <span className={cn(
                                  "px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium",
                                  feedback.cleanliness >= 8 ? "bg-green-100 text-green-800" :
                                  feedback.cleanliness >= 6 ? "bg-yellow-100 text-yellow-800" : 
                                  "bg-red-100 text-red-800"
                                )}>
                                  {feedback.cleanliness}
                                </span>
                              </TableCell>
                              <TableCell className="text-center whitespace-nowrap">
                                <span className={cn(
                                  "px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium",
                                  feedback.productAvailability >= 8 ? "bg-green-100 text-green-800" :
                                  feedback.productAvailability >= 6 ? "bg-yellow-100 text-yellow-800" : 
                                  "bg-red-100 text-red-800"
                                )}>
                                  {feedback.productAvailability}
                                </span>
                              </TableCell>
                              <TableCell className="text-center whitespace-nowrap">
                                <span className={cn(
                                  "px-1 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium",
                                  feedback.overallExperience >= 8 ? "bg-green-100 text-green-800" :
                                  feedback.overallExperience >= 6 ? "bg-yellow-100 text-yellow-800" : 
                                  "bg-red-100 text-red-800"
                                )}>
                                  {feedback.overallExperience}
                                </span>
                              </TableCell>
                              <TableCell className="max-w-[6rem] sm:max-w-xs truncate">{feedback.comment}</TableCell>
                              <TableCell className="text-center">
                                {feedback.images && feedback.images.length > 0 ? (
                                  <div className="flex gap-1 items-center justify-center">
                                    {/* Show small thumbnails of first image */}
                                    <div className="w-10 h-10 rounded overflow-hidden border border-gray-200">
                                      <img
                                        src={feedback.images[0]}
                                        alt="Feedback"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://placehold.co/100?text=Error';
                                        }}
                                      />
                                    </div>
                                    
                                    {/* Show count if more than one image */}
                                    {feedback.images.length > 1 && (
                                      <span className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                                        +{feedback.images.length - 1}
                                      </span>
                                    )}
                                    
                                    {/* View button */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewImages(feedback)}
                                      className="text-xs ml-1"
                                    >
                                      View
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">None</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Charts Tab - Improved for mobile */}
            <TabsContent value="charts" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card className="shadow-lg border border-indomie-yellow/10 relative overflow-hidden">
                  <div className="absolute inset-0 noodle-bg-light opacity-20"></div>
                  <CardHeader className="flex flex-row items-center justify-between relative z-10 p-4 md:p-6">
                    <div>
                      <CardTitle className="flex items-center gap-1 md:gap-2 text-base md:text-lg">
                        <ChartBar className="h-4 w-4 md:h-5 md:w-5" />
                        Store Performance
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Average ratings across stores
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 p-0 md:p-4 h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={STORE_PERFORMANCE_DATA}
                        margin={{ 
                          top: 20, 
                          right: 10, 
                          left: 0, 
                          bottom: isMobile ? 140 : 120 
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={80}
                          interval={0}
                          tick={{ fontSize: isMobile ? 8 : 12 }}
                        />
                        <YAxis 
                          domain={[0, 10]} 
                          tick={{ fontSize: isMobile ? 10 : 12 }}
                        />
                        <Tooltip />
                        <Bar dataKey="staffFriendliness" name="Staff Friendliness" fill="#E51E25" />
                        <Bar dataKey="cleanliness" name="Cleanliness" fill="#FFC72C" />
                        <Bar dataKey="productAvailability" name="Product Availability" fill="#2D2926" />
                        <Bar dataKey="overallExperience" name="Overall Experience" fill="#5AA9E6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="shadow-lg border border-indomie-yellow/10 relative overflow-hidden">
                  <div className="absolute inset-0 noodle-bg-light opacity-20"></div>
                  <CardHeader className="flex flex-row items-center justify-between relative z-10 p-4 md:p-6">
                    <div>
                      <CardTitle className="flex items-center gap-1 md:gap-2 text-base md:text-lg">
                        <ChartPie className="h-4 w-4 md:h-5 md:w-5" />
                        Issue Distribution
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Common issues reported
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 p-0 md:p-4 h-[300px] md:h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ISSUE_DISTRIBUTION_DATA}
                          cx="50%"
                          cy="50%"
                          labelLine={!isMobile}
                          label={isMobile ? undefined : ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={isMobile ? 80 : 120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ISSUE_DISTRIBUTION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Analytics Tab - Improved for mobile */}
            <TabsContent value="analytics" className="space-y-4 md:space-y-6">
              <Card className="shadow-lg border border-indomie-yellow/10 relative overflow-hidden">
                <div className="absolute inset-0 noodle-bg-light opacity-20"></div>
                <CardHeader className="relative z-10 p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Performance Analytics</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Key metrics and insights from customer feedback
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 p-4 md:p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    {[
                      { title: "Highest Rated Branch", value: "Lagos - Lekki Phase 1", score: "8.9/10", trend: "up" },
                      { title: "Lowest Rated Branch", value: "Abuja - Wuse II", score: "6.8/10", trend: "down" },
                      { title: "Best Service Quality", value: "Lagos - Lekki Phase 1", score: "9.1/10", trend: "up" },
                      { title: "Most Improved", value: "Port Harcourt - GRA", score: "+1.2 pts", trend: "up" },
                    ].map((metric, index) => (
                      <Card key={index} className="shadow-sm hover:shadow-md transition-shadow bg-white/70 backdrop-blur-sm border border-indomie-yellow/10">
                        <CardContent className="p-2 md:p-4">
                          <p className="text-xs md:text-sm font-medium text-gray-500 truncate">{metric.title}</p>
                          <h3 className="text-sm md:text-xl font-bold mt-1 truncate">{metric.value}</h3>
                          <div className={cn(
                            "text-xs md:text-sm font-medium mt-1 flex items-center",
                            metric.trend === "up" ? "text-green-600" : "text-red-600"
                          )}>
                            <span>{metric.score}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 md:mt-8">
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Top Customer Complaints</h3>
                    <div className="space-y-2 md:space-y-4">
                      {[
                        { issue: "Unusual taste in Chicken flavor", count: 15, locations: ["Lagos - Ikeja Mall", "Abuja - Wuse II"] },
                        { issue: "Packaging damage during transportation", count: 12, locations: ["Port Harcourt - GRA"] },
                        { issue: "Product availability issues", count: 10, locations: ["Abuja - Wuse II", "Kano - Nassarawa"] },
                      ].map((complaint, index) => (
                        <div key={index} className="p-3 md:p-4 border rounded-md bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <h4 className="font-medium text-sm md:text-base">{complaint.issue}</h4>
                            <span className="text-xs md:text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full whitespace-nowrap">
                              {complaint.count} reports
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-gray-500 mt-1 truncate">
                            <span className="font-medium">Affected:</span> {complaint.locations.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Settings Tab - Improved for mobile */}
            <TabsContent value="settings" className="space-y-4 md:space-y-6">
              <Card className="shadow-lg border border-indomie-yellow/10 relative overflow-hidden">
                <div className="absolute inset-0 noodle-bg-light opacity-20"></div>
                <CardHeader className="relative z-10 p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl">Report Settings</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Configure your reporting preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10 p-4 md:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium">Export Frequency</label>
                      <Select defaultValue="monthly">
                        <SelectTrigger className="text-xs md:text-sm h-8 md:h-10">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-medium">Report Format</label>
                      <Select defaultValue="excel">
                        <SelectTrigger className="text-xs md:text-sm h-8 md:h-10">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="pdf">PDF Document</SelectItem>
                          <SelectItem value="csv">CSV File</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-xs md:text-sm font-medium">Email Recipients</label>
                    <Input 
                      placeholder="Enter email addresses (comma-separated)"
                      defaultValue="admin@indomie.com, manager@indomie.com"
                      className="text-xs md:text-sm h-8 md:h-10"
                    />
                    <p className="text-xs text-gray-500">Reports will be automatically sent to these email addresses.</p>
                  </div>
                  
                  <Button className="bg-indomie-red hover:bg-indomie-red/90 relative overflow-hidden group text-xs md:text-sm h-8 md:h-10">
                    <span className="relative z-10">Save Settings</span>
                    <span className="absolute bottom-0 left-0 w-full h-0 bg-indomie-yellow transition-all duration-300 group-hover:h-full -z-0"></span>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Image Viewer Dialog - Updated to display actual images */}
      {selectedFeedback && (
        <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Feedback Images</DialogTitle>
              <DialogDescription>
                Submitted by {selectedFeedback.customerName} on {selectedFeedback.date}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4 my-4">
              {selectedFeedback.images && selectedFeedback.images.length > 0 ? (
                selectedFeedback.images.map((imageSrc: string, index: number) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={imageSrc}
                      alt={`Feedback image ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        console.error(`Failed to load image in dialog: ${imageSrc}`);
                        (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=Image+Load+Error';
                      }}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No images available for this feedback</p>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleCloseImageViewer}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
