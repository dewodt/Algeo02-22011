import { type Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HardDriveUpload, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Search Method Menu | HBD Lens",
  description: "Reverse image.",
};

const SearchMenuPage = () => {
  const methods = [
    {
      title: "Upload Dataset",
      description: "Compare dataset by uploading dataset folder",
      icon: <HardDriveUpload className="h-8 w-8 stroke-primary" />,
      url: "/search/upload",
    },
    {
      title: "Scrape Dataset",
      description: "Compare dataset by scraping images from the web",
      icon: <Globe className="h-8 w-8 stroke-primary" />,
      url: "/search/scrape",
    },
  ];

  return (
    <main className="flex flex-auto  items-center justify-center p-5 py-10 sm:p-12">
      <section className="flex max-w-5xl flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-3 lg:gap-4">
          <h1 className="text-center text-3xl font-bold lg:text-5xl">
            Choose compare methods!
          </h1>
          <p className="text-center text-base text-muted-foreground lg:text-xl">
            You can choose between multiple methods to compare input image to a
            dataset!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {methods.map((method, index) => {
            return (
              <Link key={index} href={method.url}>
                <Card className="flex flex-row gap-5 p-6 shadow-lg">
                  <CardContent className="flex items-center justify-center p-0">
                    {method.icon}
                  </CardContent>
                  <CardHeader className="justify-center p-0">
                    <CardTitle>{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default SearchMenuPage;
