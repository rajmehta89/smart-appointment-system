import Link from 'next/link';
import { CalendarDays, Clock, Users, Building2, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SmartBooking
              </span>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="#businesses" className="text-gray-600 hover:text-gray-900">For Business</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Sign in</Link>
              <Link 
                href="/register"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg
                         text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none
                         focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Streamline Your Appointments with{' '}
              <span className="text-blue-600">SmartBooking</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              The all-in-one appointment scheduling platform that helps you manage bookings, 
              reduce no-shows, and grow your business.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm
                         hover:bg-blue-500 focus-visible:outline focus-visible:outline-2
                         focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Start Free Trial
              </Link>
              <Link href="#demo" className="text-sm font-semibold leading-6 text-gray-900">
                See how it works <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage appointments
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <CalendarDays className="h-5 w-5 flex-none text-blue-600" />
                  Smart Scheduling
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Intelligent scheduling system that prevents double bookings and optimizes your calendar
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <Clock className="h-5 w-5 flex-none text-blue-600" />
                  Automated Reminders
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Reduce no-shows with automated SMS and email reminders to your clients
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <Users className="h-5 w-5 flex-none text-blue-600" />
                  Client Management
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Keep track of client history, preferences, and notes all in one place
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section id="businesses" className="py-16 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Perfect for all types of businesses
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether you're a solo practitioner or a large organization, SmartBooking adapts to your needs
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'Healthcare',
                  description: 'Medical clinics, dental offices, therapists',
                  icon: Building2
                },
                {
                  title: 'Beauty & Wellness',
                  description: 'Salons, spas, fitness trainers',
                  icon: Building2
                },
                {
                  title: 'Professional Services',
                  description: 'Consultants, lawyers, accountants',
                  icon: Building2
                },
                {
                  title: 'Education',
                  description: 'Tutors, coaches, instructors',
                  icon: Building2
                }
              ].map((business) => (
                <div
                  key={business.title}
                  className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-x-4">
                    <business.icon className="h-6 w-6 text-blue-600" />
                    <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">
                      {business.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{business.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-blue-600 py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your business?
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Join thousands of businesses that trust SmartBooking for their scheduling needs.
                Start your free trial today.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/register"
                  className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm
                           hover:bg-gray-100 focus-visible:outline focus-visible:outline-2
                           focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get Started
                </Link>
                <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
                  Contact Sales <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
              <div className="flex flex-col items-start">
                <div className="rounded-full bg-white/5 p-2 ring-1 ring-white/10">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <dt className="mt-4 font-semibold text-white">No credit card required</dt>
                <dd className="mt-2 leading-7 text-gray-300">
                  Start with our free plan and upgrade when you're ready
                </dd>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-full bg-white/5 p-2 ring-1 ring-white/10">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <dt className="mt-4 font-semibold text-white">Cancel anytime</dt>
                <dd className="mt-2 leading-7 text-gray-300">
                  No long-term contracts or hidden fees
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/about" className="text-gray-400 hover:text-gray-500">About</Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-500">Contact</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-500">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-500">Terms</Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} SmartBooking. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
