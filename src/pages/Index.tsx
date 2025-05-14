
import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";

/**
 * Index page component for the feedback portal
 */
const Index = () => {
  return (
    <PageLayout>
      <FeedbackForm />
    </PageLayout>
  );
};

export default Index;
