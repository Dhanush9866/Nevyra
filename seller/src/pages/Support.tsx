import React from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Mail, 
  Phone,
  ExternalLink,
  FileText,
  Video
} from 'lucide-react';

const Support: React.FC = () => {
  const faqs = [
    {
      question: 'How do I add a new product?',
      answer: 'Go to Products → Add Product. Fill in the product details, upload images, set pricing and inventory, then click "Save Product".',
    },
    {
      question: 'When will I receive my payouts?',
      answer: 'Payouts are processed on the 1st and 15th of each month. It takes 2-3 business days for the amount to reflect in your bank account.',
    },
    {
      question: 'How do I update my bank details?',
      answer: 'Bank details can only be updated by contacting our support team. This is for security purposes.',
    },
    {
      question: 'What is the platform commission?',
      answer: 'The platform charges a 10% commission on each sale. This is automatically deducted before calculating your earnings.',
    },
    {
      question: 'How do I handle returns?',
      answer: 'When a customer initiates a return, you\'ll see it in the Orders section. Accept or reject based on your return policy.',
    },
  ];

  const resources = [
    {
      title: 'Seller Guide',
      description: 'Complete guide to get started',
      icon: Book,
      link: '#',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Video,
      link: '#',
    },
    {
      title: 'API Documentation',
      description: 'For developers and integrations',
      icon: FileText,
      link: '#',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Help & Support</h1>
        <p className="page-description">
          Get help, browse FAQs, and contact support
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Live Chat</h3>
          <p className="text-sm text-muted-foreground mb-4">Chat with our support team</p>
          <button className="btn-primary w-full">Start Chat</button>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-success" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
          <p className="text-sm text-muted-foreground mb-4">support@sellerhub.com</p>
          <button className="btn-secondary w-full">Send Email</button>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-warning" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Phone Support</h3>
          <p className="text-sm text-muted-foreground mb-4">Mon-Fri, 9am-6pm EST</p>
          <button className="btn-secondary w-full">+1 (800) 123-4567</button>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="card-title mb-4">Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <a 
              key={resource.title}
              href={resource.link}
              className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="p-3 rounded-lg bg-primary/10">
                <resource.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {resource.title}
                </h4>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="card-title">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-border">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6">
              <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
