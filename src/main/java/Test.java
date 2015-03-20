public class Test {

	public static void main(String[] args) {
		int n = 4;
		boolean[][] array = new boolean[n + 1][n + 1];

		for (int i = 0; i < n + 1; i++)
			for (int j = 0; j < n + 1; j++) {
				System.out.println(j + " " + i);
				array[j][i] = false;
			}
		System.out.println("\n\n");
		for (int i = n; i >= 1; i--)
			for (int j = i - 1; j >= 1; j--) {
				System.out.println(j + " " + i);
				array[j][i] = true;
			}

		System.out.println("\n\n");

		int a = 0, b = 0;

		for (int i = 1; i <= n; i++) {
			a = 1;
			b = i;
			for (int j = 1; j <= n; j++) {
				if (array[a][b])
					System.out.print(a + ":" + b + " ");
				a++;
				b--;
				if (b == 0)
					b = n;
			}
			System.out.println();
		}

	}

}
