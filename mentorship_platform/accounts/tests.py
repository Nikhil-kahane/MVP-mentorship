from django.test import TestCase


class BasicBackendTest(TestCase):
    def test_backend_works(self):
        self.assertEqual(1 + 1, 2)
